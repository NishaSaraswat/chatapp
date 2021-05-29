export default function PhotoUpload() {

  const g = useNamedContext('global');

  // State
  const s = useStates({
    file: '',
    base64url: '',
    fileNameOnServer: ''
  });

  // Listen for changes to the file filed to trigger a preview
  useEffect(async () => {
    if (!s.file) { return; }
    // Read the file object from the file input field
    let data = await read(document.forms.fileUploadForm.file.files[0]);
    // Scale
    s.base64url = await scale(data, 1500, 1500, 0.75);
  }, [s.file]);

  // Upload the image
  const uploadImg = async e => {
    e.preventDefault();
    // Create a new photo in the db
    let newPhoto = new Photo({
      author: g.user._id,
      url: s.base64url
    });
    let result = await newPhoto.save();
    s.fileNameOnServer = result.url;
  }

  // Reset for a new upload
  const newUpload = () => {
    // reset all state variables
    // to show an empty form again
    s.fileNameOnServer = '';
    s.base64url = '';
    s.file = '';
  }

  return <SFC

    template=
    {<Row>
      <Col>
        <If c={!s.fileNameOnServer}>
          <form name="fileUploadForm" onSubmit={uploadImg}>
            <h1 className="mb-3">Upload your image</h1>
            <p>
              <input type="file" accept="image/*" name="file" {...s.bind('file')} />
              <If c={s.base64url}>
                <input type="submit" value="Upload" />
              </If>
            </p>
            <If c={s.base64url}>
              <p><img className="previewImage" src={s.base64url} /></p>
            </If>
          </form>
          <Else>
            <p>The photo has been uploaded!</p>
            <a target="_blank" href={'/uploads/' + s.fileNameOnServer}>Here's a link to your photo</a>
            <p className="mt-3"><Button variant="primary" onClick={() => newUpload()}>Upload another image</Button></p>
          </Else>
        </If>
      </Col>
    </Row>}

    style=
    {/*css*/`

      .previewImage {
        max-width: 300px;
        width:
      }

      input[type="submit"]{
        margin-left: 30px;
      }
  
    `}
  />
}