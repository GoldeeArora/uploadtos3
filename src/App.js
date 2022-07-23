import { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
// import DeleteIcon from "@mui/icons-material/Delete";
alert("click on the images to delete them");
function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchImages();
  }, []);
  const [count, setCount] = useState(0);

  async function fetchImages() {
    let imageKeys = await Storage.list("");
    imageKeys = await Promise.all(
      imageKeys.map(async (k) => {
        setCount((prevCount) => ++prevCount);
        const key = await Storage.get(k.key);
        return key;
      })
    );

    setImages(imageKeys);
  }
  async function onChange(e) {
    const file = e.target.files[0];
    console.log(count);
    if (count > process.env.REACT_APP_MAX_COUNT) {
      alert("max limit reached");
      return;
    }

    const result = await Storage.put(file.name, file, {
      contentType: "image/png",
    });

    fetchImages();
  }
  async function deleteImage(e) {
    const file = e.target.src.substring(
      e.target.src.indexOf("/public") + 8,
      e.target.src.indexOf("?")
    );

    let File = file.replaceAll("%20", " ");
    File = File.replaceAll("%28", "(");
    File = File.replaceAll("%29", ")");

    await Storage.remove(File);
    setCount((prevCount) => --prevCount);
    fetchImages();
  }
  return (
    <div className="App">
      <h1>Image Uploader</h1>
      <input type="file" name="inputImage" onChange={onChange} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {images?.map((image) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
              key={image}
            >
              <img
                src={image}
                style={{ width: 50, height: 50, marginBottom: 10 }}
                onClick={deleteImage}
                className="Image"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
