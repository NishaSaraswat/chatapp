export default function MyPhotos() {
  const g = useNamedContext('global');
  return <Photos {...{ userId: g.user._id }} />;
}