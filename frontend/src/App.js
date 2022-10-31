import './App.css';

function App() {
  return (
    <div className="App">
      <div className="top">
        
      </div>

      <div className="middleleft">

      </div>

      <div className="middleright">
      
      </div>

      <div className="middle">
        <img className="icon" src="img/logo.png" alt="" />
        <div className="title">
          프로그래머스쿠
        </div>

        <div className="login-pan">
          <p>
            아이디
          </p>
          <input type="text" placeholder="입력" name="loginId"/>
          <p className="msg" name="loginIdMsg">
            아이디를 입력하세요.
          </p>

          <p>
            비밀번호
          </p>
          <input type="password" placeholder="입력" name="loginPwd"/>
          <p className="msg" name="loginPwdMsg">
            비밀번호를 입력하세요. or 비밀번호가 옳지 않습니다.
          </p>
        </div>

        <div className="btn-pan">
            <span className="btn_login">
              로그인
            </span>
        </div>
      </div>

      <div className="bottom">
      
      </div>
        
    </div>
  );
}
export default App;
