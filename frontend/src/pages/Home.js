import React, { useState } from "react";
import { diana } from "../components/dianaWheel"
import { vingenere } from "../components/vingenereWheel"

function isAlphabeticOrSpace(text) {
  if (text === "") {
    return true;
  }
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(text);
}

function isAlphabeticOnly(text) {
  if (text === "") {
    return true;
  }
  const regex = /^[A-Za-z]+$/;
  return regex.test(text);
}

function encryptOrDecrypt(message, keyword) {
  message = message.toUpperCase();
  keyword = keyword.toUpperCase();
  let encryptedMessage = "";

  for (let i = 0; i < message.length; i++) {
    if (message[i] === " ") {
      encryptedMessage += " ";
      continue;
    }

    let messageLetterNum = message.charCodeAt(i) - 65;
    let keywordLetterNum = keyword.charCodeAt(i % keyword.length) - 65;
    let encryptedLetter = 25 - messageLetterNum - keywordLetterNum;

    encryptedLetter < 0 ? (encryptedLetter += 26) : (encryptedLetter += 0);

    encryptedMessage += String.fromCharCode(encryptedLetter + 65);
  }

  return encryptedMessage;
}

function vingenereEncryptOrDecrypt(message, keyword, encrypt) {
  message = message.toUpperCase();
  keyword = keyword.toUpperCase();
  let encryptedMessage = "";

  for (let i = 0; i < message.length; i++) {
    if (message[i] === " ") {
      encryptedMessage += " ";
      continue;
    }

    let messageLetterNum = message.charCodeAt(i) - 65;
    let keywordLetterNum = keyword.charCodeAt(i % keyword.length) - 65;
    let encryptedLetter = encrypt ? messageLetterNum + keywordLetterNum : messageLetterNum - keywordLetterNum;

    encryptedLetter > 25 ? (encryptedLetter -= 26) : (encryptedLetter += 0);
    encryptedLetter < 0 ? (encryptedLetter += 26) : (encryptedLetter += 0);

    encryptedMessage += String.fromCharCode(encryptedLetter + 65);
  }

  return encryptedMessage;
}

const Home = () => {
  const [method, setMethod] = useState('Diana');
  const [methodWheel, setMethodWheel] = useState(diana)
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [encryptedMessageOutput, setEncryptedMessageOutput] = useState("");
  const [messageError, setMessageError] = useState("")
  const [keyError, setKeyError] = useState("");
  const [charInput, setCharInput] = useState("");

  const handleMethodChange = (e) => {
    const m = e.target.value;
    setMethod(m);
    
    if (m === 'Diana') {
      setMethodWheel(diana)
    } else {
      setMethodWheel(vingenere)
    }

    setMessage("")
    setEncryptedMessageOutput("")
    setKey("")
    setCharInput("")
  };

  const handleMessageChange = (e) => {
    const messageInput = e.target.value;

    if (isAlphabeticOrSpace(messageInput) && messageInput.length < 75) {
      setMessage(messageInput);
      setMessageError("");
    } else if (!isAlphabeticOrSpace(messageInput)){
      setMessageError("Message must be alphabetical")
    } else {
      setMessageError("Cannot exceed 75 characters")
    }
  };

  const handleKeyChange = (e) => {
    const keyInput = e.target.value;

    if (isAlphabeticOnly(keyInput) && keyInput.length < 75) {
      setKey(keyInput);
      setKeyError("");
    } else if (!isAlphabeticOnly(keyInput)){
      setKeyError("Invalid Key")
    } else {
      setKeyError("Cannot exceed 75 characters")
    }
  };

  const handleFormEncryptSubmit = (e) => {
    console.log("Message", message)
    e.preventDefault();
    if (message === "") {
      setMessageError("Message must not be empty");
      return;
    }
    if (key === "") {
      setKeyError("Key must not be empty");
      return;
    }
    if (!keyError) {
      if (method === 'Diana') {
        setEncryptedMessageOutput(`${encryptOrDecrypt(message, key)}`);
      } else {
        setEncryptedMessageOutput(`${vingenereEncryptOrDecrypt(message, key, true)}`)
      }
    }
  };

  const handleDecryptClick = (e) => {
    e.preventDefault();
    if (message === "") {
      setMessageError("Message must not be empty");
      return;
    }
    if (key === "") {
      setKeyError("Key must not be empty");
      return;
    }
    if (!keyError) {
      setEncryptedMessageOutput(`${vingenereEncryptOrDecrypt(message, key, false)}`);
    }
  };

  const handleCharInputChange = (e) => {
    const input = e.target.value.toUpperCase();
    if (input.length === 1 && isAlphabeticOnly(input)) {
      setCharInput(input);
    } else {
      setCharInput("");
    }
  };

  return (
    <div className="home">
      <div className="panel">
        <h2 className="title">Encryption/Decryption</h2>
        <div className="header">
          <label htmlFor="method">Choose Method:</label>
          <select id="method" value={method} onChange={handleMethodChange}>
            <option value="Vigenere">Vigenere</option>
            <option value="Diana">Diana</option>
          </select>
        </div>
        <form onSubmit={handleFormEncryptSubmit}>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={handleMessageChange}
            />
            {messageError && <div className="error">{messageError}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="key">Key:</label>
            <input
              type="text"
              id="key"
              value={key}
              onChange={handleKeyChange}
            />
            {keyError && <div className="error">{keyError}</div>}
          </div>
          <div className="form-footer">
            <button type="submit" className="submit-button">
              {method === "Diana" ? "Encrypt/Decrypt" : "Encrypt"}
            </button>
            {method === 'Vigenere' && (
              <button
                type="button"
                className="submit-button"
                onClick={handleDecryptClick}
              >
                Decrypt
              </button>
            )}
            <div className="output">
              <h3>{encryptedMessageOutput}</h3>
            </div>
          </div>
        </form>
      </div>
      <div className="wheel-container">
        <div className="wheel">
          <span style={{ "--i": 0 }}></span>
          <span style={{ "--i": 1 }}></span>
          <span style={{ "--i": 2 }}></span>
          <span style={{ "--i": 3 }}></span>
          <span style={{ "--i": 4 }}></span>
          <span style={{ "--i": 5 }}></span>
          <span style={{ "--i": 6 }}></span>
          <span style={{ "--i": 7 }}></span>
          <span style={{ "--i": 8 }}></span>
          <span style={{ "--i": 9 }}></span>
          <span style={{ "--i": 10 }}></span>
          <span style={{ "--i": 11 }}></span>
          <span style={{ "--i": 12 }}></span>
          <span style={{ "--i": 13 }}></span>
          <span style={{ "--i": 14 }}></span>
          <span style={{ "--i": 15 }}></span>
          <span style={{ "--i": 16 }}></span>
          <span style={{ "--i": 17 }}></span>
          <span style={{ "--i": 18 }}></span>
          <span style={{ "--i": 19 }}></span>
          <span style={{ "--i": 20 }}></span>
          <span style={{ "--i": 21 }}></span>
          <span style={{ "--i": 22 }}></span>
          <span style={{ "--i": 23 }}></span>
          <span style={{ "--i": 24 }}></span>
          <span style={{ "--i": 25 }}></span>
          <div className="letter">
            <b style={{ "--i": 0 }}>A</b>
            <b style={{ "--i": 1 }}>B</b>
            <b style={{ "--i": 2 }}>C</b>
            <b style={{ "--i": 3 }}>D</b>
            <b style={{ "--i": 4 }}>E</b>
            <b style={{ "--i": 5 }}>F</b>
            <b style={{ "--i": 6 }}>G</b>
            <b style={{ "--i": 7 }}>H</b>
            <b style={{ "--i": 8 }}>I</b>
            <b style={{ "--i": 9 }}>J</b>
            <b style={{ "--i": 10 }}>K</b>
            <b style={{ "--i": 11 }}>L</b>
            <b style={{ "--i": 12 }}>M</b>
            <b style={{ "--i": 13 }}>N</b>
            <b style={{ "--i": 14 }}>O</b>
            <b style={{ "--i": 15 }}>P</b>
            <b style={{ "--i": 16 }}>Q</b>
            <b style={{ "--i": 17 }}>R</b>
            <b style={{ "--i": 18 }}>S</b>
            <b style={{ "--i": 19 }}>T</b>
            <b style={{ "--i": 20 }}>U</b>
            <b style={{ "--i": 21 }}>V</b>
            <b style={{ "--i": 22 }}>W</b>
            <b style={{ "--i": 23 }}>X</b>
            <b style={{ "--i": 24 }}>Y</b>
            <b style={{ "--i": 25 }}>Z</b>
          </div>
        </div>
        <div className="wheel inner" style={{ transform: `rotate(${((-1) * charInput.charCodeAt(0) - 65) * (360/26)}deg)`}}>
          <span style={{ "--i": 0 }}></span>
          <span style={{ "--i": 1 }}></span>
          <span style={{ "--i": 2 }}></span>
          <span style={{ "--i": 3 }}></span>
          <span style={{ "--i": 4 }}></span>
          <span style={{ "--i": 5 }}></span>
          <span style={{ "--i": 6 }}></span>
          <span style={{ "--i": 7 }}></span>
          <span style={{ "--i": 8 }}></span>
          <span style={{ "--i": 9 }}></span>
          <span style={{ "--i": 10 }}></span>
          <span style={{ "--i": 11 }}></span>
          <span style={{ "--i": 12 }}></span>
          <span style={{ "--i": 13 }}></span>
          <span style={{ "--i": 14 }}></span>
          <span style={{ "--i": 15 }}></span>
          <span style={{ "--i": 16 }}></span>
          <span style={{ "--i": 17 }}></span>
          <span style={{ "--i": 18 }}></span>
          <span style={{ "--i": 19 }}></span>
          <span style={{ "--i": 20 }}></span>
          <span style={{ "--i": 21 }}></span>
          <span style={{ "--i": 22 }}></span>
          <span style={{ "--i": 23 }}></span>
          <span style={{ "--i": 24 }}></span>
          <span style={{ "--i": 25 }}></span>
          {methodWheel}
        </div>
        <div className="wheel small">
          <div>
            <input className = "jolop"
              type="text"
              value={charInput}
              onChange={handleCharInputChange}
              maxLength={1}
              placeholder="A"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;