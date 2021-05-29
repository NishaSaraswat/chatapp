export default function Routes() {

  let g = useNamedContext('global');

  useEffect(() => {
    g.routes = {
      '/': ['Start', Start],
      '/my-photos': ['My photos', MyPhotos],
      '/photos': ['All photos', Photos],
      '/photo-upload': ['Upload a photo', PhotoUpload],
      '/chat': ['Chat', Chat]
    }
  }, []);

  return <Switch>
    {Object.entries(g.routes || {}).reverse().map(([path, [, component]], i) =>
      <Route path={path} key={i}>
        {component && React.createElement(component, {})}
      </Route>
    )}
  </Switch>;
}