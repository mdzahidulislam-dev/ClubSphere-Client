import styled from "styled-components";

const PhotoInput = ({ children, preview }) => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="header">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-25 w-100  object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          )}
        </div>
        <label htmlFor="file" className="footer">
          {children}
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    @apply bg-primary/10
    height: 100%;
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    gap: 5px;
    background-color: #ff56561a;
  }

  .header {
    flex: 1;
    width: 100%;
    border: 2px dashed #ff5656;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .header svg {
    height: 100px;
  }

  .header p {
    text-align: center;
    color: black;
  }

  .footer {
    background-color: #ff56561a;
    width: 100%;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: black;
    border: none;
  }

  .footer svg {
    height: 130%;
    fill: #ff5656;
    background-color: rgba(70, 66, 66, 0.203);
    border-radius: 50%;
    padding: 4px 6px;

    cursor: pointer;
    box-shadow: 0 2px 30px rgba(0, 0, 0, 0.205);
  }
  .footer svg:hover {
    background-color: #ff5656;
    fill: #fff;
  }
  .footer p {
    flex: 1;
    text-align: center;
  }

  #file {
    display: none;
  }
`;

export default PhotoInput;
