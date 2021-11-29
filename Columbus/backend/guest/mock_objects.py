class MockRequest:
    def __init__(self, method, body):
        self.method = method
        self.body = body

    def json(self):
        return self.json_data


def mock_create_user(username, email, password, first_name, last_name):
    return MockUserInside(username=username, email=email, password=password, first_name=first_name, last_name=last_name)


class MockUserInside:
    def __init__(self, username, email, password, first_name, last_name):
        self.username = username
        self.firstname = first_name
        self.lastname = last_name
        self.useremail = email
        self.password = password
        self.is_active = True

    def save(self):
        return True


class MockCreateUser:
    def __init__(self, username, email, password, first_name, last_name):
        self.objects = mock_create_user(username, email, password, first_name, last_name)
        self.username = username
        self.email = email
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
