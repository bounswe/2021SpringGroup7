from django.template.loader import render_to_string

class MockRequest:
    def __init__(self, method, body, uri="ec2-35"):
        self.method = method
        self.data = body
        self.absolute_uri = uri

    def build_absolute_uri(self):
        return self.absolute_uri


def mock_create_user(username, email, password, first_name, last_name):
    return MockUserInside(username=username, email=email, password=password, first_name=first_name, last_name=last_name)


class MockUserInside:
    def __init__(self, username, email, password, first_name, last_name):
        self.username = username
        self.firstname = first_name
        self.lastname = last_name
        self.email = email
        self.password = password
        self.is_active = True
        self.id = "id"

    def save(self):
        return True

    def set_password(self, password):
        return password

def mock_create_email(user):
    message = render_to_string('acc_active_email.html', {
        'user': user,
        'domain': 'ec2-35-158-103-6.eu-central-1.compute.amazonaws.com',
        'uid': "1",
        'token': "token",
    })
    return MockEmailMessage(user=user,  message=message, email=user.email)


class MockEmailMessage:
    def __init__(self, user, message, email):
        self.user = user
        self.message = message
        self.email = email

    def send(self):
        return True