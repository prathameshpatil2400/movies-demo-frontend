import React from "react";

type PreviewType = string | ArrayBuffer | null;

const PreviewFile = ({ file }: { file: File }) => {
  const [preview, setPreview] = React.useState<PreviewType>(null);

  const reader = new FileReader();

  reader.readAsDataURL(file);

  function isFileImage(file: File): boolean {
    return file && file["type"].split("/")[0] === "image";
  }

  reader.onload = () => {
    setPreview(isFileImage(file) ? reader.result : "/default.svg");
  };

  return (
    <img
      src={preview as string}
      className="preview"
      alt="Preview"
      height={"100%"}
      width={"100%"}
    />
  );
};

export default PreviewFile;
