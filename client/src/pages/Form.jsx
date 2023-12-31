import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const Form = () => {
  const [ urlValue, setUrlValue ] = useState('')
  const [ userInput, setUserInput ] = useState('')
  const [ shortUrl, setShortUrl ] = useState('')
  const [ result, setResult ] = useState(false)

  const handleURLChange = (e) => {
    const input = e.target.value
    setUrlValue(input)
  }
  
  const handleUserInput = (e) => {
    const input = e.target.value
    setUserInput(input)
    setShortUrl(input)
    setResult(false)
  }

  const handleKeyPress = (e) => {
    if(e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault()
    }
  }

  const handleMinify = async (e) => {
    e.preventDefault()
    if(!urlValue.length > 0){
      return toast.error('Enter long Url to shorten')
    }
    if(userInput && userInput.length < 6){
      return toast.error('shortURL must be at least 6 characters')
    }
    const loading = toast.loading('Generating URL')
    try {
      const response = await axios.post('https://minify.onrender.com/api/minify', {
        longUrl: urlValue,
        userOption: userInput ? userInput : ''
      })
      let url = response.data.shortUrl
      setShortUrl(`minify.onrender.com/${url}`)
      setResult(true)
      toast.dismiss(loading)
      toast.success('short url generated successfully')
    } catch (error) {
      let message = await error.response?.data
      toast.dismiss(loading)
      toast.error(message)
    }
  }

  const handleCopy = async (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(shortUrl).then(
      () => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'))
  }

  const userInputMax = 6

  return (
    <div className="formContainer">
      <ToastContainer 
      position="bottom-right"
      autoClose={5000}
      hideprogressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      draggable
      theme='colored'
      />
      <form>
        
        <input type="text" 
        placeholder="Enter a valid url e.g https://www.google. . ." 
        className="input urlInput" 
        onChange={handleURLChange}
        value={urlValue} 
        onKeyDown={handleKeyPress}
        />
        <div className="userOption cont">
          <div className="minifyText">
            <p>Minify.com</p>
          </div>
          <input 
          type="text" 
          className="input" 
          placeholder='e.g 3fWaCd (optional)'
          onChange={handleUserInput}
          maxLength={userInputMax}
          value={userInput}
          onKeyDown={handleKeyPress}
          />
        </div>
        <button type="submit" className="btn" onClick={handleMinify}>Minify</button>

        {result && <div className="result">
          <div className="cont resultText">
            <input 
            type="text" 
            className="input" 
            value={shortUrl}
            readOnly
              style={{ color: '#7db3ec', fontSize: '16px'}}
            />
          </div>
            <button 
            className="copy" 
            onClick={handleCopy}
            >Copy</button>
        </div>}
      </form>
      <div className="blur top"></div>
      <div className="blur bottom"></div>
    </div>
  )
}

export default Form