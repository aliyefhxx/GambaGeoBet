import React, { useState } from "react"
import styled from "styled-components"
import { useUserStore } from "../hooks/useUserStore"

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`

const Modal = styled.div`
  background: #111;
  padding: 30px;
  border-radius: 15px;
  width: 380px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
`

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
  text-shadow: 0 0 5px #00ffe7;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 6px 0;
  border-radius: 8px;
  border: 1px solid #00ffe7;
  background: #000;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: 0.2s;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #0ff;
    box-shadow: 0 0 8px #0ff;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #00ffe7, #0088ff);
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`

const Switch = styled.p`
  margin-top: 15px;
  color: #fff;
  font-size: 14px;

  span {
    color: #00ffe7;
    cursor: pointer;
    font-weight: bold;
  }
`

export default function AuthModal() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [phone, setPhone] = useState("")
  const [passport, setPassport] = useState("")
  const [age, setAge] = useState("")
  const [birth, setBirth] = useState("")

  const register = useUserStore((state) => state.register)
  const login = useUserStore((state) => state.login)
  const user = useUserStore((state) => state.currentUser)

  // Əgər artıq login olunubsa → modal göstərilməsin
  if (user) return null

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      alert("ყველა ველი უნდა შეავსოთ")
      return
    }

    const success = register({
      username,
      password,
      displayName: name + " " + surname,
      phone,
      passport,
      age: Number(age),
      birthday: birth,
    })

    if (!success) {
      alert("მომხმარებელი უკვე არსებობს")
    } else {
      alert("ანგარიში შეიქმნა ✅ თქვენ მიიღეთ 200 ₾ ბონუსი!")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(username, password)
    if (!success) {
      alert("მომხმარებელი ან პაროლი არასწორია")
    }
  }

  return (
    <Overlay>
      <Modal>
        <Title>{isRegister ? "რეგისტრაცია " : "შესვლა "}</Title>

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <Input
            type="text"
            placeholder="მომხმარებლის სახელი"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="პაროლი"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegister && (
            <>
              <Input type="text" placeholder="სახელი" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="text" placeholder="გვარი" value={surname} onChange={(e) => setSurname(e.target.value)} />
              <Input type="text" placeholder="ტელეფონის ნომერი" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input type="text" placeholder="პასპორტის კოდი" value={passport} onChange={(e) => setPassport(e.target.value)} />
              <Input type="number" placeholder="ასაკი" value={age} onChange={(e) => setAge(e.target.value)} />
              <Input type="text" placeholder="დაბადების თარიღი (dd/mm/yyyy)" value={birth} onChange={(e) => setBirth(e.target.value)} />
            </>
          )}

          <Button type="submit">{isRegister ? "რეგისტრაცია" : "შესვლა"}</Button>
        </form>

        <Switch>
          {isRegister ? (
            <>
              უკვე გაქვთ ანგარიში?{" "}
              <span onClick={() => setIsRegister(false)}>შესვლა</span>
            </>
          ) : (
            <>
              არ გაქვთ ანგარიში?{" "}
              <span onClick={() => setIsRegister(true)}>რეგისტრაცია</span>
            </>
          )}
        </Switch>
      </Modal>
    </Overlay>
  )
}
