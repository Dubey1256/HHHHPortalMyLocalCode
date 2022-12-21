
function Tab(){
return(
    <>
    <ul className="nav nav-tabs" id="myTab" role="tablist">

          <li className="nav-item" role="presentation">

            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>

          </li>

          <li className="nav-item" role="presentation">

            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>

          </li>

          <li className="nav-item" role="presentation">

            <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Contact</button>

          </li>

        </ul>

        <div className="tab-content border border-top-0" id="myTabContent">

          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

<div className="row  p-2">

tab a

</div>




          </div>

          <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">



            <div className="row  p-2">
tab 2

             

            </div>

          </div>

          <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">



            <div className="row  p-2">
tab 3

             

            </div>



          </div>

        </div>
        </>
)
}