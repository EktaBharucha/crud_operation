import './App.css';
import React, { useEffect, useState } from 'react';
import serialize from 'form-serialize';
import { Modal } from 'react-responsive-modal';
import "react-responsive-modal/styles.css";
import axios from 'axios';
import swal from 'sweetalert';

const token = "d1cad3240d56968ec685e35fd78cdfdac206d49ec50c3eb1a4806231d0a2de20";
const passURL = "https://gorest.co.in/public/v2/users/";
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

function App() {
  const [responseData, setResponseData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gender, setGender] = useState("male");
  const [statusValue, setStatusValue] = useState("active");
  const [editObject, setEditObject] = useState({});

  useEffect(() => { getData(); }, [])

  // to open add data modal
  const onModalOpen = () => {
    setIsModalOpen(true);
  }

  // to close add data modal
  const onModalClose = () => {
    setIsModalOpen(false);
  }

  // to open edit data modal
  const onEditModalOpen = (item) => {
    setGender(item.gender);
    setStatusValue(item.status);
    setEditObject(item);
    setIsEditModalOpen(true);
  }

  // to close edit data modal
  const onEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditObject({});
  }

  // get the data to the API
  const getData = (e) => {

    axios.get(passURL, config).then((response) => {

      console.log("response", response);
      setResponseData(response.data)

    }).catch((error) => {

      console.log("An error while Get the data");

      console.log(error);

    });

  }

  // add data
  const handleSubmit = (e) => {

    e.preventDefault();

    let form = document.querySelector('#submitData');
    let formData = serialize(form, { hash: true, empty: true });

    axios.post(passURL, formData, config).then((response) => {

      console.log("response", response.data);
      getData();
      onModalClose();

    }).catch((error) => {

      console.log("An error while Creating the Data");

      console.log(error);

    });

  }

  // handle radio button click event and change state
  const handleRadioInputClick = (e) => {
    setGender(e.target.value);
  }
  const resetStatusValue = (e) => {
    setStatusValue(e);
  }

  // delete data
  const deleteData = (id) => {

		let tempButtons = {
			Cancel: { text: "Cancel", value: "cancel" },
			Enable: { text: "Enable", value: "enable" }
		}

    swal({
      title: "Are you sure you want to delete this data?",
      icon: "warning",
      buttons: tempButtons,
      closeOnClickOutside: false

    }).then((result) => {

      if (result === "enable") {
        let urlToDelete = passURL + id;
        axios.delete(urlToDelete, config).then((response) => {

          getData();
          onModalClose();

        }).catch((error) => {

          console.log("An error while Deleteing the Data");
          console.log(error);

        });

      }
    })

  }

  // update data
  const updateData = (e) => {

    e.preventDefault();

    let form = document.querySelector('#submitData');
    let formData = serialize(form, { hash: true, empty: true });

    let editUrl = passURL + editObject.id;

    axios.put(editUrl, formData, config).then((response) => {

      console.log("response", response.data);
      getData();
      onEditModalClose();

    }).catch((error) => {

      console.log("An error while Creating the Data");
      console.log(error);

    });

  }

  return (
    <div className="App">
      <h3 className='text-center'>Listing Of Candidate</h3>
      <div className='row'>
        <div className='col-md-8 col-md-offset-2'>
          <button type="button" className="btn btn-primary add-candidate" onClick={() => onModalOpen()}>Add Candidate</button>
        </div>
      </div>
      <div className='tableData'>
        <div className='col-md-8 col-md-offset-2'>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {responseData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.gender}</td>
                    <td>{item.status}</td>
                    <td>
                      <div className='buttonDesign'>
                        <button className='btn btn-danger' onClick={() => deleteData(item.id)}>Delete</button>
                        <button className='btn btn-success' onClick={() => onEditModalOpen(item)}>Edit</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={onModalClose}
        center
        closeOnOverlayClick={false}
        animationDuration={1000}
        closeOnEsc={false}
        blockScrol={false}
        styles={{
          modal: {
            width: "570px",
            height: "auto"
          }
        }}
      >
        <div>
          <h3 className='text-center'>Add Data</h3>
          <form className="formData" id="submitData" onSubmit={(event) => handleSubmit(event)}>
            <div className="">
              <div className="">
                <div className='form-display'>
                  <div className='input-textbox'>
                    <div className='label-input'>Name *</div>
                    <input type="text" placeholder='Name' className="form-control" id="firstName" name="name" />
                  </div>
                  <div className='input-textbox'>
                    <div className='label-input'>Email *</div>
                    <input type="email" placeholder='Email' className="form-control" id="email" name="email" />
                  </div>
                  <div className='input-textbox'>
                    <div className='label-input'>Gender *</div>
                    <div id="gender" className='radioButtons'>
                      <input type="radio" checked={gender === "male"} name="gender" value="male" onChange={e => handleRadioInputClick(e)} /> <span>Male</span>
                    </div>

                    <div id="gender" className="radioButtons">
                      <input type="radio" checked={gender === "female"} name="gender" value="female" onChange={e => handleRadioInputClick(e)} /> <span>Female </span>
                    </div>
                  </div>
                  <div className='input-textbox'>
                    <div className='label-input'>Status *</div>
                    <select name="status" className='form-control' value={statusValue} onChange={(e) => resetStatusValue(e.target.value)}>
                      <option key="active" value="active">Active</option>
                      <option key="inactive" value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className='text-center'>
                    <div className='input-textbox'>
                      <button className="btn">
                        Add Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

        </div>
      </Modal>

      <Modal
        open={isEditModalOpen}
        onClose={onEditModalClose}
        center
        closeOnOverlayClick={false}
        animationDuration={1000}
        closeOnEsc={false}
        blockScrol={false}
        styles={{
          modal: {
            width: "570px",
            height: "auto"
          }
        }}
      >
        <div>
          <h3 className='text-center'>Edit Data</h3>
          <form className="formData" id="submitData" onSubmit={(event) => updateData(event)}>
            <div className="">
              <div className="">
                <div className='form-display'>
                  <div className='input-textbox'>
                    <div className='label-input'>Name *</div>
                    <input type="text" placeholder='Name' className="form-control" id="firstName" name="name" defaultValue={editObject.name} />
                  </div>
                  <div className='input-textbox'>
                    <div className='label-input'>Email *</div>
                    <input type="email" placeholder='Email' className="form-control" id="email" name="email" defaultValue={editObject.email} />
                  </div>
                  <div className='input-textbox'>
                    <div className='label-input'>Gender *</div>
                    <div id="gender" className='radioButtons'>
                      <input type="radio" checked={gender === "male"} name="gender" value="male" onChange={e => handleRadioInputClick(e)} /> <span>Male</span>
                    </div>

                    <div id="gender" className="radioButtons">
                      <input type="radio" checked={gender === "female"} name="gender" value="female" onChange={e => handleRadioInputClick(e)} /> <span>Female </span>
                    </div>
                  </div>
                  <div className='input-textbox'>
                    <div className='label-input'>Status *</div>
                    <select name="status" className='form-control' value={statusValue} onChange={(e) => resetStatusValue(e.target.value)}>
                      <option key="active" value="active">Active</option>
                      <option key="inactive" value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className='text-center'>
                    <div className='input-textbox'>
                      <button className="btn">
                        Edit Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

        </div>
      </Modal>
    </div>
  );
}

export default App;
