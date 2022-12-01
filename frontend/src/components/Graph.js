import { ResponsivePie } from "@nivo/pie";
import PropTypes from "prop-types";

const theme = {
  fontSize: "14px",
};

function Graph({ efficiencyScore, readabilityScore, score }) {
  const data = [
    {
      id: "efficiency",
      label: "efficiency",
      value: efficiencyScore,
      color: "hsl(50, 100%, 65%)",
    },
    {
      id: "readability",
      label: "readability",
      value: readabilityScore,
      color: "hsl(196, 100%, 60%)",
    },
    {
      id: "score",
      label: "score",
      value: score,
      color: "hsl(90, 57%, 65%)",
    },
  ];

  return (
    <ResponsivePie
      theme={theme}
      data={data}
      margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ datum: "data.color" }}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
    />
  );
}

Graph.propTypes = {
  efficiencyScore: PropTypes.number.isRequired,
  readabilityScore: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default Graph;
