import "../styles/editor.css";
import PropTypes from "prop-types";
import { DiffEditor } from "@monaco-editor/react";

function CodeEditorDiff({ original, modified }) {
  return (
    <DiffEditor
      // height="100%"
      original={original}
      modified={modified}
      language="python"
      theme="my-theme"
      options={{
        fontFamily: "I",
        fontSize: 14,
        lineHeight: 18,
        minimap: {
          enabled: false,
        },
        readOnly: true,
      }}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("my-theme", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: { "editor.background": "#1A202C" },
        });
      }}
    />
  );
}

CodeEditorDiff.propTypes = {
  original: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
};

export default CodeEditorDiff;
