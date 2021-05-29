export default function Photos(props) {

  const s = useStates({});

  useEffect(async () => {
    console.log(props.userId)
    // fetching all photos
    s.photos = await Photo.find({ author: props.userId }).populate('author');
    // newest photos on top
    s.photos.sort((a, b) => a.posted > b.posted ? -1 : 1);
  }, []);

  return <SFC

    template=
    {!s.photos ? null : <Row>
      <Col>
        <h1>{props.userId ? 'My photos' : 'All photos'}</h1>
        {s.photos.map(photo =>
          <div className="photo" key={photo._id} >
            <img src={'/uploads/' + photo.url} />
            <p>Photographer: {photo.author.name}</p>
          </div>
        )}
      </Col>
    </Row>}

    style=
    {/*css*/`

      .photo {
        display: inline-block;
        width: 33.3%;
        border: 15px solid #fff;
      }

      h1 {
        padding-left: 15px;
      }

      img {
        width: 100%;
      }

  
    `}
  />
}