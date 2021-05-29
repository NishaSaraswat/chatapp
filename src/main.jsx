import { mountAndImport } from 'react-easier';

// mongoosy models and make global
import mongoosy from 'mongoosy/frontend';
const { Message, Photo, User, Login } = mongoosy;
Object.assign(globalThis, { Message, Photo, User, Login });

mountAndImport({
  // the module that starts your app
  component: () => import('./App'),
  // a selector for the html element to mount it in
  rootSelector: '#root',
  // import all modules you want to be global
  globalImports: [
    'React', import('react'),
    'ReactDOM', import('react-dom'),
    import('react-easier'),
    import('react-router-dom'),
    'BrowserRouter as Router',
    'NavLink as MenuLink',
    import('react-bootstrap'),
    // our own components/modules
    'MainNav', import('./components/MainNav'),
    'Routes', import('./components/Routes'),
    'Footer', import('./components/Footer'),
    'LoginForm', import('./components/LoginForm'),
    'SignupForm', import('./components/SignupForm'),
    'Start', import('./views/Start'),
    'Photos', import('./views/Photos'),
    'MyPhotos', import('./views/MyPhotos'),
    'PhotoUpload', import('./views/PhotoUpload'),
    'Chat', import('./views/Chat'),
    import('./utilities/photo-upload'),
    import('./utilities/updateHandler')
  ]
});