import "./organizationalObjectives.css";

// displays the organizational objectives along with the goal of how much increase is planned for the year (on project and hr managers dashboard so that the goals they assign to their team are aligned according to these objectives)
const OrganizationalObjectives = (organizationalObjectives, goalPercentageIncrease) => {
  const objectivesArray =
    organizationalObjectives.organizationalObjectives || [];

  return (
    <div className="organizational-objectives-container">
      <div className="organizational-objectives">Organizational Objectives</div>
      {/* <Link to="/HrQuaterlyGoals" className="see-more-quarterly-goals">
        See all
      </Link> */}
      <div className="organizational-goals-headings">
        <div className="organizational-goals-ObjectiveID">Objective ID</div>
        <div className="organizational-goals-Name">Objective</div>
        <div className="organizational-goals-Status">Goal</div>
      </div>
      {objectivesArray.map((objective, index) => (
        <div key={index} className="organizational-goal-row">
          <div className="organizational-goals-ObjectiveID">{`0${
            index + 1
          }`}</div>
          <div className="organizational-goals-Name">{objective}</div>
          <div className="organizational-goals-Status">
            {/* {assignedCounts[objective] || 0} people */}
            <span className="assigned-count">
              {/* {assignedCounts[objective] || 0} people */}
              {organizationalObjectives.goalPercentageIncrease[index]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationalObjectives;
