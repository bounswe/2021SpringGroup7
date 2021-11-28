class MockRequest:
    def __init__(self, method, body):
        self.method = method
        self.body = body

    def json(self):
        return self.json_data


class MockUserManager():

    def create_user(self, username, email , password , first_name , last_name):
        return MockUserManager(username=username, email=email , password=password , first_name=first_name , last_name=last_name)

class MockUser:
    def __init__(self,username, email , password , first_name , last_name):
        self.objects = MockUserManager
        self.user_name = username
        self.first_name = first_name
        self.last_name = last_name
        self.user_email = email
        self.password = password
        self.is_active = True

    def save(self):
        return True