from configparser import ConfigParser
from sqlalchemy import create_engine, exc
import os

def read_config():

    current_dir = os.path.dirname(__file__)
    file_path = os.path.join(current_dir, '../config.ini')

    config = ConfigParser()
    config.read(file_path)

    return config

def connection_uri(db_tag_name="history_database"):
    config = read_config()

    URI = 'postgresql+psycopg2://{}:{}@/{}?host={}'.format(
        config['history_database']['user'],
        config['history_database']['password'],
        config['history_database']['dbname'],
        config['history_database']['host']
    )

    return URI

def create_history_table():

    URI = connection_uri()
    my_connection = None
    TABLE_NAME = "calculations"

    CREATE_TABLE_QUERY = """
                    CREATE TABLE IF NOT EXISTS {} (
                        first_operand INT NOT NULL,
                        second_operand INT NOT NULL,
                        answer INT NOT NULL,
                        PRIMARY KEY(first_operand, second_operand)
                    )""".format(TABLE_NAME)
    
    try:
        engine = create_engine(URI, echo=False)
        my_connection = engine.connect()
        my_connection.execute(CREATE_TABLE_QUERY)

        return "Table created successfully"

    except exc.SQLAlchemyError as error:
        return 'Error trying to create table: {}'.format(error)

    finally:
        my_connection.close()
        engine.dispose()

def insert_calculation(firstNum, secondNum, answer):
    URI = connection_uri()
    my_connection = None

    try:
        engine = create_engine(URI, echo=True)
        my_connection = engine.connect()

        my_connection.execute('INSERT INTO calculations VALUES (%s, %s, %s)', (firstNum, secondNum, answer))
        return "Insertion successful"

    except exc.SQLAlchemyError as err:
        return 'Error occured inserting into table {}. Exception: {}'.format("calculations", err)

    finally:
        my_connection.close()
        engine.dispose()

def get_calculations():

    URI = connection_uri()
    my_connection = None
    
    GET_CALCULATIONS_QUERY = """
                                SELECT * FROM calculations
                             """

    try:
        engine = create_engine(URI, echo=False)
        my_connection = engine.connect()

        calculations = my_connection.execute(GET_CALCULATIONS_QUERY)

        calculations_history = {}

        i = 1
        for row in calculations:
            calculations_history[i] = (row['first_operand'], row['second_operand'], row['answer'])
            i += 1

        return calculations_history

    except exc.SQLAlchemyError as err:
        return 'Error fetching from table {}. Exception: {}'.format("calculations", err)

    finally:
        my_connection.close()
        engine.dispose()


def delete_calculation(firstNum, secondNum):

    URI = connection_uri()
    my_connection = None

    try:
        engine = create_engine(URI, echo=False)
        my_connection = engine.connect()
        my_connection.execute('DELETE from calculations WHERE first_operand = {} AND second_operand = {}'.format(firstNum, secondNum))
        return "Deletion successful"
    except exc.SQLAlchemyError as err:
        return 'Error deleting data from table {}. Exception: {}'.format("calculations", err)

    finally:
        my_connection.close()
        engine.dispose()

if __name__ == "__main__":
    #print(get_calculations())
    #print(delete_calculation(1000, 1000))
    # print(insert_calculation(2, 2, 4))
    # print(insert_calculation(10, 10, 20))
    # print(insert_calculation(15, 15, 30))
    print(get_calculations())

    

    
