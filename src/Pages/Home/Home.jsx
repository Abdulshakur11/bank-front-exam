import { useEffect, useRef, useState } from 'react';
import './Home.css';
// import { Alert }

function App() {
  const [company, setCompany] = useState([]);
  const [complex, setComplex] = useState([]);
  const [numberOfRooms, setNumberOfRooms] = useState([]);
  const [banks, setBanks] = useState([]);

  const [calcFunction, setCalcFunction] = useState();
  const [companyName, setCompanyName] = useState();
  const [complexName, setComplexName] = useState();
  const [roomsInfo, setRoomsInfo] = useState();
  const [bankInfo, setBankInfo] = useState();

  const nameRef = useRef();
  const surnameRef = useRef();
  const phoneNumberRef = useRef();

  useEffect(() => {
    fetch('https://exam-8-backend.herokuapp.com/company')
      .then(res => res.json())
      .then(data => setCompany(data))
      .catch(err => console.log(err))
  }, []);

  useEffect(() => {
    fetch('https://exam-8-backend.herokuapp.com/bank')
      .then(res => res.json())
      .then(data => setBanks(data))
      .catch(err => console.log(err))
  }, []);

  // ================= [[[[{}]]]] ================ //
  const handleCompany = (e) => {
    const infoWrapper = document.querySelector('.info-wrapper');
    infoWrapper.style.display = "flex"
    const optionElement = e.target.childNodes[e.target.selectedIndex];
    const companyId = optionElement.getAttribute('id');
    setCompanyName([company.find(e => e.company_id === companyId)])
    fetch(`https://exam-8-backend.herokuapp.com/complex?company_id=${companyId}`)
      .then(res => res.json())
      .then(data => setComplex(data))
      .catch(err => console.log(err))
  };


  // ================ [[[[{}]]]] =============== //
  const handleComplex = (e) => {
    setComplexName([{ complex_name: e.target.value }]);
    const optionElement = e.target.childNodes[e.target.selectedIndex];
    const complexId = optionElement.getAttribute('id');
    fetch(`https://exam-8-backend.herokuapp.com/number_of_romms?complex_id=${complexId}`)
      .then(res => res.json())
      .then(data => setNumberOfRooms(data))
      .catch(err => console.log(err))
  }

  // =============== [[[[{}]]]] =============== //
  const handleRooms = (e) => {
    const bank = document.querySelector('.bank-select');
    bank.disabled = false;
    const optionElement = e.target.childNodes[e.target.selectedIndex];
    const roomId = optionElement.getAttribute('id');
    const roomInfo = numberOfRooms.find(e => e.number_of_room_id === roomId);
    setRoomsInfo([roomInfo]);
  };

  // =============== [[[[{}]]]] =============== //
  const handleBank = (e) => {
    const optionElement = e.target.childNodes[e.target.selectedIndex];
    const bankId = optionElement.getAttribute('id');
    const findBank = banks.find(e => e.bank_id === bankId);
    setBankInfo([findBank]);
    const { starting_paymant, moratge_duration } = findBank;
    const roomID = roomsInfo.map(e => e.number_of_room_id);

    const btn = document.querySelector('.submit-btn');
    btn.disabled = false;
    fetch(`https://exam-8-backend.herokuapp.com/calc_func?starting_paymant=${starting_paymant}&&moratge_duration=${moratge_duration}&&number_of_room_id=${roomID[0]}`)
      .then(res => res.json())
      .then(data => setCalcFunction([data]))
      .catch(err => console.log(err))
  }


  const hanleKeyUp = (e) => {
    const sendBtn = document.querySelector('.send-btn');
    if (e.target.value.length > 12) {
      sendBtn.disabled = false;
    } else {
      sendBtn.disabled = true;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://exam-8-backend.herokuapp.com/requests', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_name: nameRef.current.value,
        user_surname: surnameRef.current.value,
        phone_number: phoneNumberRef.current.value,
      })
    })
      .then(res => res.json())
      .then(data => alert(data))
      .catch(err => console.log(err))

  }


  return (
    <>
      <div>
        <h2 className='site-title'>Choose a house by filtering</h2>
        <div className='select-wrapper'>
          <form className='select-form' onSubmit={handleSubmit}>
          
            <div>
              <h3>Building company:</h3>
              <select defaultValue="choose" className='form-select all-selects' name="company" onChange={(e) => { handleCompany(e) }}>
                <option disabled hidden value="choose">Choose</option>
                {company && company.map((e, i) => (
                  <option key={i} id={e.company_id} value={e.company_name}>{e.company_name}</option>
                ))}
              </select>
            </div>

            <div>
              <h3>Complex:</h3>
              <select defaultValue="choose" className='form-select all-selects' name="complex" onChange={(e) => { handleComplex(e) }}>
                <option disabled hidden value="choose">Choose</option>
                {complex && complex.map((e, i) => (
                  <option key={i} id={e.complex_id} value={e.complex_name}>{e.complex_name}</option>
                ))}
              </select>
            </div>

            <div>
              <h3>Number of rooms:</h3>
              <select defaultValue="choose" className='form-select all-selects' name="number_of_rooms" onChange={(e) => { handleRooms(e) }}>
                <option disabled hidden value="choose">Choose</option>
                {numberOfRooms && numberOfRooms.map((e, i) => (
                  <option key={i} id={e.number_of_room_id} value={e.number_of_room}>{e.number_of_room}</option>
                ))}
              </select>
            </div>

            <div>
              <h3>Mortgage duration:</h3>
              <select defaultValue="choose" className='form-select all-selects bank-select' disabled={true} name="bank" onChange={(e) => { handleBank(e) }}>
                <option disabled hidden value="choose">Choose</option>
                {banks && banks.map((e, i) => (
                  <option id={e.bank_id} key={i} value={`${e.bank_name} ${e.moratge_duration}`}>{`${e.bank_name} ${e.moratge_duration} year`}</option>
                ))}
              </select>
            </div>

            <button type="button" className="btn btn-outline-success submit-btn" disabled={true} data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Buy</button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">New message</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="user-name" className="col-form-label">Name:</label>
                      <input ref={nameRef} type="text" className="form-control" name='user_name' id="user-name" placeholder='Name' required />

                      <label htmlFor="sur_name" className="col-form-label">Surname:</label>
                      <input ref={surnameRef} type="text" className="form-control" name='user_surname' id="sur_name" placeholder='Surname' required />

                      <label htmlFor="phone_number" className="col-form-label">Phone number:</label>
                      <input ref={phoneNumberRef} onKeyUp={(e) => { hanleKeyUp(e) }} type="text" className="form-control" name='phone_number' id="phone_number" placeholder='Phone number' required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" disabled={true} className="btn btn-primary send-btn">Send message</button>
                  </div>
                </div>
              </div>
            </div>

          </form>

        </div>

        <div className='info-wrapper'>
          <div className='info'>
            {companyName && companyName.map((e, i) => (
              <div key={i}>
                <img className='img' src={e.company_img} alt="company-logo" />
                <h4 className='company-name'>{e.company_name}</h4>
              </div>
            ))}

            {complexName && complexName.map((e, i) => (
              <h4 className='complex-name' key={i}>{e.complex_name}</h4>
            ))}

            {roomsInfo && roomsInfo.map((e, i) => (
              <div className='rooms-info' key={i}>
                <p>{e.number_of_room} rooms</p>
                <p>{e.price_each_square} so'm each meter square</p>
                <h5>{e.all_meter_of_square} meters square</h5>
                <p>{e.address_of_complex}</p>
              </div>
            ))}
          </div>

          <div className='info'>
            {bankInfo && bankInfo.map((e, i) => (
              <div className='bank' key={i}>
                <img className='img' src={e.bank_img} alt="bank-logo" />
                <h5 className='company-name bank-n'>{e.bank_name}</h5>
                <p>{e.bank_creadit} so'm upto</p>
                <p>Mortage duration: {e.moratge_duration} year</p>
                <h4>Starting paymant: {e.starting_paymant}%</h4>
                <h4>{e.moratge_duration} year</h4>
              </div>
            ))}
          </div>

          <div className='info'>
            {calcFunction && calcFunction.map((e, i) => (
              <div className='calc' key={i}>
                <h3>Calculator</h3>
                <p>House price: {e.house_price} so'm</p>
                <p>Starting paymant: {e.starting_paymant} so'm</p>
                <p>Monthly paymant: {e.monthly_paymant} so'm</p>
                {bankInfo && bankInfo.map((e, i) => (
                  <div key={i}>
                    <p>Bank service: {e.bank_service} million</p>
                    <p>Paymant duration: {e.moratge_duration} year</p>
                  </div>
                ))}
              </div>
            ))}
          </div>


        </div>
      </div>
    </>
  );
}

export default App;
