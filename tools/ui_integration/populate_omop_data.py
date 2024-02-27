from google.cloud import bigquery
import json
import re
import os

# TODO - fix auth flow for this script
# https://developers.google.com/people/quickstart/python
# https://google-auth.readthedocs.io/en/master/user-guide.html


# Note for Users
# manual workflow for authenticating
# gcloud auth application-default login
# GOOGLE_APPLICATION_CREDENTIALS=/Users/sholden/.config/gcloud/application_default_credentials.json

## You'll need to set this to a DSP google project that you have job big query access on
gcp_with_access = "terra-datarepo-alpha"
gcp_project = "bigquery-public-data"
gcp_dataset = "cms_synthetic_patient_data_omop"

concept_ancestor_file_path = "files/OMOPDataset/concept_ancestor.json"

person_limit = 2
person_ids = set()
concept_ids = set()

def main():
    # Manually remove existing concept_ancestor file since we just append to it
    if os.path.isfile(concept_ancestor_file_path):
        os.remove(concept_ancestor_file_path)

    client = bigquery.Client(project=gcp_with_access)
    # person
    query_root_person_table(client)

    # Occurrence Tables
    # To add later - "observation", "observation_period",  "device_exposure"
    query_table_where_person_id_record_concepts(client, "procedure_occurrence", 49)
    query_table_where_person_id_record_concepts(client, "condition_occurrence", 19)
    query_table_where_person_id_record_concepts(client, "drug_exposure", 13)

    # Static Reference Tables
    query_table_all_results(client, "domain")
    # Tables to add later - another reference table - "vocabulary", "relationship", "concept_class"

    # Concept tables
    query_table_where_concepts(client, "concept", "concept_id")
    #query_table_where_concepts(client, "concept_relationship", "concept_id_1")
    # Populate based on concepts where the concept id is the descendant_concept_id and domain id is the ancestor_concept_id
    #query_table_where_concepts(client, "concept_ancestor", "ancestor_concept_id") # TODO - deal with descendant_concept_id field

def query_table_all_results(client, table_name):
    query = f"Select * FROM `{gcp_project}.{gcp_dataset}.{table_name}`;"
    query_table(client, query, table_name)

def query_root_person_table(client):
    person_table = "person"
    query = f"Select * FROM `{gcp_project}.{gcp_dataset}.{person_table}` LIMIT {person_limit};"
    records = query_table(client, query, person_table)
    for record in records:
        person_ids.add(record["person_id"])

def query_table_where_person_id_record_concepts(client, table_name, domain_id):
    person_ids_str = ', '.join(str(id) for id in person_ids)
    query = f"Select * FROM `{gcp_project}.{gcp_dataset}.{table_name}` WHERE person_id IN ({person_ids_str});"
    records = query_table(client, query, table_name)
    # Loosely match on "concept_id" colum name since the column name varies between tables that maps to concept_id
    table_concept_ids = set()
    for record in records:
        for i in record.keys():
            if(i.find("concept_id") != -1):
                item = record[i]
                if item is not None:
                    table_concept_ids.add(record[i])
                    concept_ids.add(record[i])
    with open(concept_ancestor_file_path, "a") as file:
        for concept_id in table_concept_ids:
            json_obj_formatted = format_content(str({"ancestor_concept_id": domain_id, "descendant_concept_id": concept_id, "min_levels_of_separation": 1, "max_levels_of_separation": 1}) + "\n")
            file.write(json_obj_formatted)

def query_table_where_concepts(client, table_name, concept_id_field):
    concept_ids_str = ', '.join(str(id) for id in concept_ids)
    query = f"Select * FROM `{gcp_project}.{gcp_dataset}.{table_name}` WHERE {concept_id_field} IN ({concept_ids_str});"
    query_table(client, query, table_name)

def query_table(client, query, table_name):
    query_job = client.query(query)
    rows = query_job.result()

    records = [dict(row) for row in rows]
    json_obj = json.dumps(str(records))
    json_obj_formatted = format_json(json_obj)

    # Write rows to json file
    with open(f"files/OMOPDataset/{table_name}.json", "w") as file:
        file.write(json_obj_formatted)
    return records

def format_json(json_obj):
    json_obj_formatted = format_content(json_obj)
    # Remove outer list brackets and quotes
    json_obj_no_brackets = json_obj_formatted[2:-2]
    # Add newlines between json objects instead of commas
    return json_obj_no_brackets.replace("}, {", "}\n{")

def format_content(json_obj):
    # regex to match "datetime.date(2009, 7, 15)" and replace with "2009-07-15"
    json_obj_with_dates = re.sub(r"datetime.date\((\d+), (\d+), (\d+)\)", r"'\1-\2-\3'", json_obj)
    # Handle \" in json
    json_obj_switch_to_single_quotes = json_obj_with_dates.replace("\\\"", "'")
    # Switch to double quotes
    json_obj_correctly_quoted = json_obj_switch_to_single_quotes.replace("{'", "{\"").replace("'}", "\"}").replace(", '", ", \"").replace("',", "\",").replace("':", "\":").replace(": '", ": \"")
    # Replace "None" with "null"
    return json_obj_correctly_quoted.replace("None", "null")

if __name__ == "__main__":
    main()