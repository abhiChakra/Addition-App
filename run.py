from gevent.pywsgi import WSGIServer
from flask_app.app import app

# As flask is not a production suitable server, we use will
# a WSGIServer instance to serve our flask application. 
if __name__ == '__main__':  
    WSGIServer(('0.0.0.0', 8000), app).serve_forever()
