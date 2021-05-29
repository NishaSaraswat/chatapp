export default function LoginForm() {

  const g = useNamedContext('global');

  const s = useStates({
    name: '',
    email: '',
    password: '',
    passwordAgain: '',
    failMessage: ''
  });

  async function signup(e) {
    e.preventDefault();
    if (s.password !== s.passwordAgain) {
      s.failMessage = 'Passwords did not match. Please try again!';
      return;
    }
    let newUser = new User({
      name: s.name,
      email: s.email,
      password: s.password
    });
    let result = await newUser.save();
    if (result.error) {
      s.failMessage = 'Email taken, please try another one!';
      return;
    }
    // success, so login
    await Login.login({ email: s.email, password: s.password });
    g.user = await Login.check();
  }

  return <>
    <h1 className="mb-3">Sign up</h1>
    <If c={s.failMessage}>
      <p className="text-danger">{s.failMessage}</p>
    </If>
    <Form onSubmit={signup}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control required type="text"
          placeholder="Enter your name" {...s.bind('name')} />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control required type="email"
          placeholder="Enter email" {...s.bind('email')} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control required minLength="6" type="password" placeholder="Password" {...s.bind('password')} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control required minLength="6" type="password" placeholder="Repeat the password" {...s.bind('passwordAgain')} />
      </Form.Group>

      <Button variant="primary" type="submit">Sign up</Button>
    </Form>
  </>
}