uvicorn app.main:app --reload
/opt/homebrew/bin/python3.14 -m venv venv
python -m pip install -r requirements.txt
python -m app.init_db