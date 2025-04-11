import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import CustomImageTool from "./CustomImageTool";

const EditorTools = {
  paragraph: {
    class: Paragraph,
    config: {
      placeholder: "Write something...",
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Header text...",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  code: {
    class: CodeTool,
    config: {
      placeholder: "Write your code here...",
    },
  },
  image: {
    class: CustomImageTool,
    config: {
      // endpoints: {
      //   byFile: "http://127.0.0.1:8000/api/uploadImage",
      // },
      field: "image_url",
      captionPlaceholder: "Add a caption...",
      buttonContent: "Upload an image",
    },
  },
};

export default EditorTools;
