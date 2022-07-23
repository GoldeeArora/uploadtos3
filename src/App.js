import { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
// import DeleteIcon from "@mui/icons-material/Delete";
function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchImages();
  }, []);
  // console.log(images);
  async function fetchImages() {
    let imageKeys = await Storage.list("");
    imageKeys = await Promise.all(
      imageKeys.map(async (k) => {
        const key = await Storage.get(k.key);
        return key;
      })
    );
    // console.log("imageKeys: ", imageKeys);
    setImages(imageKeys);
  }
  async function onChange(e) {
    const file = e.target.files[0];
    // console.log(file.name);
    const result = await Storage.put(file.name, file, {
      contentType: "image/png",
    });
    console.log({ result });
    fetchImages();
  }
  async function deleteImage(e) {
    await Storage.remove(
      e.target.src.substring(
        e.target.src.indexOf("/public") + 8,
        e.target.src.indexOf("?")
      )
    );
    fetchImages();
  }
  return (
    <div className="App">
      <h1>Test</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {images.map((image) => {
          return (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <img
                src={image}
                key={image}
                style={{ width: 50, height: 50, marginBottom: 10 }}
                onClick={deleteImage}
              />
              {/* <button onClick={deleteImage}>del</button> */}
            </div>
          );
        })}
      </div>
      <input type="file" onChange={onChange} />
    </div>
  );
}

export default App;
