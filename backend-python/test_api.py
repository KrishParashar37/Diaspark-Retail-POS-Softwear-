import urllib.request
import urllib.error

try:
    response = urllib.request.urlopen('http://localhost:5000/api/customers')
    print(response.read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())
