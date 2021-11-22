import React from "react";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: "",
      fNameValue: "",
      lNameValue: "",
    };
  }

  render() {
    return (
      <>
        
        <form
          action="https://niftyprice.us20.list-manage.com/subscribe/post"
          method="POST"
          noValidate
        >
          <input type="hidden" name="u" value="b0f3d3beed36b68ec728193f2" />
          <input type="hidden" name="id" value="81a76cd0b4" />
          <label htmlFor="MERGE0">
            
            <input
            placeholder="your email address"
              type="email"
              name="EMAIL"
              id="MERGE0"
              value={this.state.emailValue}
              onChange={(e) => {
                this.setState({ emailValue: e.target.value });
              }}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </label>

          <input
            type="submit"
            value="Subscribe"
            name="subscribe"
            id="mc-embedded-subscribe"
            className="button"
          />

          <div
            style={{ position: "absolute", left: "-5000px" }}
            aria-hidden="true"
            aria-label="Please leave the following field empty"
          >
            <label htmlFor="b_email">Email: </label>
            <input
              type="email"
              name="b_email"
              tabIndex="-1"
              value=""
              id="b_email"
            />
          </div>
        </form>
      </>
    );
  }
}

export default Form;
