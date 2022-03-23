The `setup_ui_integration.py` script can be used to easily create datasets and snapshots in the Data Repo.

Usage:
1. `pip3 install -r requirements.txt`
2. `gcloud auth login <user>`
3. `python setup_ui_integration.py --host <datarepo_url> --datasets <dataset_specification_file> --profile_id <profile_id>`

When run with the default values, this script will create datasets for the Data Repo UI tests 
in the "integration 4" deployment using a new billing profile.
