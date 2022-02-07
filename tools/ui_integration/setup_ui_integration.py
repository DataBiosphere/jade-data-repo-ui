from data_repo_client import Configuration, ApiClient, ProfilesApi, DatasetsApi, SnapshotsApi, JobsApi
import argparse
import subprocess
import json
import os
import time
import uuid

DATASETS_TO_UPLOAD = [
    {
        "name": "V2F_GWAS_Summary_Statistics",
        "tables": [
            "ancestry_specific_meta_analysis",
            "feature_consequence",
            "dataset_specific_analysis",
            "frequency_analysis",
            "trans_ethnic_meta_analysis",
            "transcript_consequence",
            "variant",
        ],
        "format": "json",
        "stewards": ["JadeStewards-dev@dev.test.firecloud.org"],
        "custodians": [],
        "snapshot_creators": []
    },
    {
        "name": "NonStewardDataset",
        "tables": [],
        "format": "json",
        "stewards": [],
        "custodians": [],
        "snapshot_creators": ["JadeStewards-dev@dev.test.firecloud.org"]
    }
]


class Clients:
    def __init__(self, host):
        config = Configuration()
        config.host = host
        token_output = subprocess.run(['gcloud', 'auth', 'print-access-token'], capture_output=True)
        config.access_token = token_output.stdout.decode("UTF-8").strip()
        self.api_client = ApiClient(configuration=config)

        self.profiles_api = ProfilesApi(api_client=self.api_client)
        self.datasets_api = DatasetsApi(api_client=self.api_client)
        self.snapshots_api = SnapshotsApi(api_client=self.api_client)
        self.jobs_api = JobsApi(api_client=self.api_client)


def wait_for_job(clients, job_model):
    result = job_model
    while True:
        if result is None or result.job_status == "running":
            time.sleep(10)
            print(f"Waiting for job {job_model.id} to finish")
            result = clients.jobs_api.retrieve_job(job_model.id)
        elif result.job_status == 'failed':
            result = clients.jobs_api.retrieve_job_result(job_model.id)
            raise f"Could not complete job with id {job_model.id}, got result {result}"
        elif result.job_status == "succeeded":
            print(f"Job {job_model.id} succeeded")
            result = clients.jobs_api.retrieve_job_result(job_model.id)
            return result
        else:
            raise "Unrecognized job state %s" % result.job_status


def create_billing_profile(clients):
    with open(os.path.join("files", "billing_profile.json")) as billing_profile_json:
        billing_profile_request = json.load(billing_profile_json)
        profile_id = str(uuid.uuid4())
        billing_profile_request['id'] = profile_id
        billing_profile_request['profileName'] = billing_profile_request['profileName'] + f'_{profile_id}'
        print(f"Creating billing profile with id: {profile_id}")
        profile = wait_for_job(clients, clients.profiles_api.create_profile(billing_profile_request=billing_profile_request))
        return profile


def dataset_ingest_json(clients, dataset_id, dataset_to_upload):
    for table in dataset_to_upload['tables']:
        with open(os.path.join("files", dataset_to_upload["name"],
                               f"{table}.{dataset_to_upload['format']}")) as table_csv:
            ingest_request = {
                "format": "json",
                "path": f"gs://jade-testdata-useastregion/V2F_GWAS_Summary_Statistics/{table}.json",
                "table": table
            }
            print(f"Ingesting data into {dataset_to_upload['name']}/{table}")
            wait_for_job(clients, clients.datasets_api.ingest_dataset(dataset_id, ingest=ingest_request))


def add_dataset_policy_members(clients, dataset_id, dataset_to_upload):
    for steward in dataset_to_upload['stewards']:
        print(f"Adding {steward} as a steward")
        clients.datasets_api.add_dataset_policy_member(dataset_id, "steward", policy_member={"email": steward})
    for custodian in dataset_to_upload['custodians']:
        print(f"Adding {custodian} as a custodian")
        clients.datasets_api.add_dataset_policy_member(dataset_id, "custodian", policy_member={"email": custodian})
    for snapshot_creator in dataset_to_upload['snapshot_creators']:
        print(f"Adding {snapshot_creator} as a snapshot_creator")
        clients.datasets_api.add_dataset_policy_member(dataset_id, "snapshot_creator", policy_member={"email": snapshot_creator})


def create_dataset(clients, dataset_to_upload, profile_id):
    dataset_name = dataset_to_upload['name']

    dataset = None
    with open(os.path.join("files", dataset_name, "dataset_schema.json")) as dataset_schema_json:
        dataset_request = json.load(dataset_schema_json)
        dataset_request['defaultProfileId'] = profile_id
        print(f"Creating dataset {dataset_name}")
        dataset = wait_for_job(clients, clients.datasets_api.create_dataset(dataset=dataset_request))
        print(f"Created dataset {dataset_name} with id: {dataset['id']}")

    if dataset_to_upload['format'] == "json":
        dataset_ingest_json(clients, dataset['id'], dataset_to_upload)

    add_dataset_policy_members(clients, dataset['id'], dataset_to_upload)
    return dataset


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='https://jade-4.datarepo-integration.broadinstitute.org')
    parser.add_argument('--profile_id')
    args = parser.parse_args()
    clients = Clients(args.host)

    profile_id = args.profile_id
    if profile_id is None:
        profile_job_response = create_billing_profile(clients)
        profile_id = profile_job_response['id']

    datasets = []
    for dataset_to_upload in DATASETS_TO_UPLOAD:
        created_dataset = create_dataset(clients, dataset_to_upload, profile_id)

        datasets.append(created_dataset)

    for dataset in datasets:
        print(f"Created dataset {dataset['name']} with id: {dataset['id']}")


if __name__ == "__main__":
    main()
