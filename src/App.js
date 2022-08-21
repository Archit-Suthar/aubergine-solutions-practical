import "./App.css";
import { useState } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";

function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [lang, setLang] = useState("en");
  const [originalQuote, setOriginal] = useState("");
  // const template = useRef(null);

  //function to fetch the quote
  const fetchQuote = async () => {
    const randNum = Math.floor(Math.random() * 500);
    const result = await axios.get(
      `https://programming-quotes-api.herokuapp.com/Quotes?count=${randNum}`
    );
    setQuote(result.data[randNum - 1].en);
    setAuthor(result.data[randNum - 1].author);
  };

  //function to toggle the language
  const toggleLang = async () => {
    if (quote.length !== 0) {
      if (lang === "en") {
        const { data } = await axios.post(
          "https://translation.googleapis.com/language/translate/v2",
          {},
          {
            params: {
              q: quote,
              target: "sr",
              key: "AIzaSyCHUCmpR7cT_yDFHC98CZJy2LTms-IwDlM",
            },
          }
        );
        let translatedQuote = data.data.translations[0].translatedText;
        setOriginal(quote);
        setQuote(translatedQuote);
        setLang("sr");
      } else {
        setQuote(originalQuote);
        setLang("en");
      }
    }
  };

  //function to download image
  const donwloadImage = () => {
    var node = document.getElementById("template");
    domtoimage.toPng(node).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "image.png";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="App">
      <div id="template">
        {quote.length === 0 ? "" : <h1>"{quote}"</h1>}
        {author.length === 0 ? "" : <h2>-{author}</h2>}
        <div style={{ height: "20px" }}></div>
      </div>
      <button onClick={fetchQuote}>Generate</button>
      <button onClick={toggleLang}>Toggle</button>
      <button onClick={donwloadImage}>Download</button>
    </div>
  );
}

export default App;
