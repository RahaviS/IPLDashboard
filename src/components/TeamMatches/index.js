import {Component} from 'react'
import {Link} from 'react-router-dom'
import {PieChart, Pie, Cell, Legend, ResponsiveContainer} from 'recharts'
import Loader from 'react-loader-spinner'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

class TeamMatches extends Component {
  state = {teamMatches: {}, isLoading: true}

  componentDidMount() {
    this.getTeamMatches()
  }

  getUpdatedData = obj => ({
    competingTeam: obj.competing_team,
    competingTeamLogo: obj.competing_team_logo,
    date: obj.date,
    firstInnings: obj.first_innings,
    id: obj.id,
    manOfTheMatch: obj.man_of_the_match,
    matchStatus: obj.match_status,
    result: obj.result,
    secondInnings: obj.second_innings,
    umpires: obj.umpires,
    venue: obj.venue,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerUrl: fetchedData.team_banner_url,
      latestMatch: this.getUpdatedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getUpdatedData(eachMatch),
      ),
    }

    this.setState({teamMatches: formattedData, isLoading: false})
  }

  renderRecentMatchesList = () => {
    const {teamMatches} = this.state
    const {recentMatches} = teamMatches
    return (
      <ul className="recent-matches-list">
        {recentMatches.map(recentMatch => (
          <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    )
  }

  renderPieChart = () => {
    const {teamMatches} = this.state
    const {latestMatch, recentMatches} = teamMatches
    let noOfWins = 0
    let noOfLoses = 0
    let noOfDraws = 0
    const latestMatchStatus = latestMatch.matchStatus
    if (latestMatchStatus === 'Won') {
      noOfWins += 1
    } else if (latestMatchStatus === 'Lost') {
      noOfLoses += 1
    } else {
      noOfDraws += 1
    }
    for (let i = 0; i < recentMatches.length; i += 1) {
      if (recentMatches[i].matchStatus === 'Won') {
        noOfWins += 1
      } else if (recentMatches[i].matchStatus === 'Lost') {
        noOfLoses += 1
      } else {
        noOfDraws += 1
      }
    }
    const data = [
      {count: noOfWins, label: 'Won'},
      {count: noOfLoses, label: 'Lost'},
      {count: noOfDraws, label: 'Draw'},
    ]
    console.log(data)
    return (
      <div className="pie-section">
        <h1 className="statistics-text">Statistics</h1>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              cx="40%"
              cy="40%"
              data={data}
              startAngle={0}
              endAngle={360}
              innerRadius="30%"
              outerRadius="70%"
              dataKey="count"
            >
              <Cell name="No Of Wins" fill="#16f7f0" />
              <Cell name="No of Loses" fill="#cc51fc" />
              <Cell name="No of Draws" fill="#f7bb16" />
            </Pie>
            <Legend
              iconType="circle"
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderTeamMatches = () => {
    const {teamMatches} = this.state
    const {teamBannerUrl, latestMatch} = teamMatches
    return (
      <div className="responsive-container">
        <Link to="/" className="home-link">
          <button type="button" className="back-btn">
            Back
          </button>
        </Link>
        <img src={teamBannerUrl} alt="team banner" className="team-banner" />
        {this.renderPieChart()}
        <LatestMatch latestMatchData={latestMatch} />

        {this.renderRecentMatchesList()}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'sh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state

    // const {latestMatch} = teamMatches
    // console.log(latestMatch.competingTeam)
    const className = `team-matches-container ${this.getRouteClassName()}`
    return (
      <div className={`container ${className}`}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}
export default TeamMatches
