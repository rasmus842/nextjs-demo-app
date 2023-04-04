import os
from dotenv import load_dotenv
import json
import pymysql


# load metadata of sql migration files (timestamp, filename, etc)
def getSqlEntries(journal_file_path):
  with open(journal_file_path, 'r') as j:
    try:
      journal = json.load(j)
      entries = journal["entries"]
      assert len(entries) > 0
      return entries
    except Exception as e:
      print('Failed to load sql metadata')
      raise e


# load the metadata of the last sql migration file that was run
def getTimestamp(timestamp_file_path):
  with open(timestamp_file_path, 'r') as t:
    try:
      timestamp = json.load(t)
      test = timestamp["idx"]
      return timestamp
    except Exception as e:
      print('Failed to load timestamp')
      return None


# update entries - find the last run entry and remove all entries up to it (lastly remove itself)
"""
shape of an entry or timestamp:
{
  idx: number, # index starting from 0
  version: string,
  when: number, # integer timestamp
  tag: string # the sql file name
}
"""
def updateEntries(entries, timestamp):
  print('Entries: ', entries)
  print('Timestamp: ', timestamp)
  if (timestamp != None):
    head_entry = entries[0]
    while head_entry != timestamp:
      entries.pop(0)
      if len(entries) == 0:
        # invalid timestamp
        raise Exception('Matching entry not found!')
      head_entry = entries[0]
  # found matching entry, pop the last run migration
  entries.pop(0)
  if (len(entries) == 0):
    raise Exception('Database already synced! Stopping execution of migration script...')
  print('Final entries: ', entries)
  return entries


def updateTimestamp(timestamp_file_path, entries):
  # update timestamp file before commiting
  timestamp = entries[-1]
  with open(timestamp_file_path, 'w') as t:
    json.dump(timestamp, t)
  print('Updated timestamp file: ', timestamp)


def getConfig():
  load_dotenv()
  # MySQL database connection configuration
  return {
      'user': os.getenv('DATABASE_USERNAME'),
      'passwd': os.getenv('DATABASE_PASSWORD'),
      'host': os.getenv('DATABASE_HOST'),
      'database': os.getenv('DATABASE_NAME'),
      'ssl_ca': os.getenv('SSL_CA')
  }


def executeSqlMigrationFiles(migrations_dir, entries, connection):
  for entry in entries:
    fileName = entry["tag"] + '.sql'
    print('Executing SQL file: ' + fileName)

    with open(os.path.join(migrations_dir, fileName), 'r') as f:
      sql = f.read().strip()

    statements = sql.split(';')[:-1] # remove last empty string element
    for statement in statements:

      statement = statement.strip()

      if (statement.__contains__('FOREIGN KEY')):
        # Foreign key constraints are not added to planetscale mysql database
        print('===== SQL =====\n' + statement + '\n===== IGNORED FOREIGN KEY CONSTRAINT =====\n')

      else:
        # Execute the SQL statement
        print('===== SQL =====\n' + statement)
        cursor = connection.cursor()
        cursor.execute(statement)
        cursor.close()
        print('===== EXECUTED =====\n')


if __name__ == '__main__':
  raise Exception('Running this python file not allowed!')