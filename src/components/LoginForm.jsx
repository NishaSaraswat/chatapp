export default function LoginForm() {

  const g = useNamedContext('global');

  const s = useStates({
    email: '',
    password: '',
    failMessage: ''
  });

  async function login(e) {
    e.preventDefault();
    let result = (await Login.login({
      email: s.email,
      password: s.password
    })).js;

    if (result.error) {
      s.failMessage = 'Something went wrong. Please try again!';
      s.email = '';
      s.password = '';
    }
    else {
      g.user = result;
    }
  }

  return <Row>
    <Col>
      <If c={s.signup}>
        <SignupForm />
        <Else>
          <h1 className="mb-3">Login</h1>
          <a onClick={() => s.signup = true}
            className="mb-4 d-block" href="#">Sign up instead?</a>
          <If c={s.failMessage}>
            <p className="text-danger">{s.failMessage}</p>
          </If>
          <Form onSubmit={login}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="email"
                placeholder="Enter email" {...s.bind('email')} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control required minLength="6" type="password" placeholder="Password" {...s.bind('password')} />
            </Form.Group>

            <Button variant="primary" type="submit">Login</Button>
          </Form>
        </Else>
      </If>
    </Col>
  </Row>
}