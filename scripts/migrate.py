import os
from dotenv import load_dotenv
import pymysql
from migrate_functions import *

# Directory containing the SQL files
MIGRATIONS_DIR = 'src/db/migrations'

# File that contains metadata of the last run sql migration file
MIGRATION_TIMESTAMP_FILE_PATH = 'scripts/migrate-timestamp.json'

if __name__ == '__main__':
  journal_path = os.path.join(MIGRATIONS_DIR, 'meta/_journal.json')
  entries = getSqlEntries(journal_path)
  timestamp = getTimestamp(MIGRATION_TIMESTAMP_FILE_PATH)

  entries = updateEntries(entries, timestamp)

  db_config = getConfig()
  connection = pymysql.connect(**db_config)
  print('Connected to database!')

  try:
    print('Executing sql migration!\n')
    executeSqlMigrationFiles(MIGRATIONS_DIR, entries, connection)
    connection.commit()
    print('Changes commited!')
  except Exception as e:
    print('\n===== EXCEPTION =====')
    print(e)
    print('===== EXCEPTION =====\n')
    connection.rollback()
  finally:
    connection.close()
    print('Closed connection to database!')

  updateTimestamp(MIGRATION_TIMESTAMP_FILE_PATH, entries)
