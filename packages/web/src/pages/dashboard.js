import React from "react"
import styled from "styled-components"
import axios from "axios"
// UIs
import { Button } from "ui"
import Private from "../components/Private"
import Layout from "../components/Layout"

const Container = styled.div`
  max-width: 60rem;
  margin: 0 auto;
  margin-top: 15vh;
  padding: 5rem;
  border: 2px solid maroon;
  border-radius: 5px;
`

const Title = styled.div`
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.4rem;
  text-transform: uppercase;
`

const Status = styled.div`
  padding: 1.5rem;
  background: #7c1813;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  letter-spacing: 1px;
  font-size: 2rem;
  font-weight: 700;
`

class DashboardPage extends React.Component {
  state = { loading: true, status: "" }

  async componentDidMount() {
    const res = await axios.get(
      `${process.env.GATSBY_API_URL}/application/status`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    )

    if (res.data.status === "INCOMPLETE") {
      this.props.navigate("/apply")
    }

    this.setState({ loading: false, status: res.data.status })
  }

  async going(isGoing) {
    await axios.post(
      `${process.env.GATSBY_API_URL}/application/going`,
      { isGoing: isGoing },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    )

    this.setState({ status: isGoing ? "ACCEPTED" : "WITHDRAWN" })
  }

  renderNote() {
    switch (this.state.status) {
      case "INCOMPLETE":
        return null
      case "ACCEPTED":
        return (
          <React.Fragment>
            <p>
              Yay!{" "}
              <span role="img" aria-label="party popper">
                🎉
              </span>{" "}
              You're all set! We look forward to having you at our event.
            </p>

            <br />
            <Button onClick={() => this.going(false)}>
              Sorry, I cannot make it!
            </Button>
          </React.Fragment>
        )
      case "WITHDRAWN":
        return (
          <React.Fragment>
            <p>
              We're sorry you can't make it. Do let us know if thing changes.
            </p>

            <br />
            <Button onClick={() => this.going(true)}>I can go now</Button>
          </React.Fragment>
        )
      default:
        return null
    }
  }

  render() {
    const { loading, status } = this.state

    if (loading) return <p>Loading</p>

    return (
      <Private>
        <Layout>
          <Container>
            <Title>Your Status:</Title>
            <Status>{status}</Status>

            <hr style={{ margin: "2rem 0" }} />

            {this.renderNote()}
          </Container>
        </Layout>
      </Private>
    )
  }
}

export default DashboardPage
