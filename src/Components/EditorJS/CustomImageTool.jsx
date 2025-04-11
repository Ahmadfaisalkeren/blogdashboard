import ImageTool from "@editorjs/image";
import axios from "axios";
import { API_URL } from "../API/ConfigAPI";

Object.defineProperty(ImageTool, "tunes", {
  get: function () {
    return [];
  },
});

class CustomImageTool extends ImageTool {
  constructor({ data, api, config }) {
    // console.log("CustomImageTool constructor called with data:", data);
    if (!window.uploadedImages) {
      window.uploadedImages = new Set();
    }
    if (!window.editorOperationState) {
      window.editorOperationState = {
        isSaving: false,
        isClearing: false,
      };
    }

    const isExistingImage = data && data.file && data.file.url;

    const customConfig = {
      ...config,
      uploader: {
        uploadByFile: async (file) => {
          try {
            const formData = new FormData();
            formData.append("image_url", file);

            const response = await axios.post(
              `${API_URL}/api/uploadImage`,
              formData
            );

            const data = response.data;

            if (data.success && data.file) {
              window.uploadedImages.add(data.file.url);
              return {
                success: data.success,
                file: {
                  url: data.file.url,
                  id: data.file.id,
                  type: "temporary",
                },
              };
            }

            return {
              success: 0,
              error: "Upload response missing required data",
            };
          } catch (error) {
            console.error("Upload error:", error);
            return {
              success: 0,
              error: "Upload failed",
            };
          }
        },
      },
    };

    super({ data, api, config: customConfig });
    this.api = api;
    this.data = data || {};
    this.onDelete = this.onDelete.bind(this);

    if (isExistingImage) {
      this._data.file = {
        ...this._data.file,
        type: "permanent",
      };
    }
  }

  render() {
    const wrapper = super.render();

    const imageElements = wrapper.getElementsByTagName("img");
    if (imageElements.length > 1) {
      for (let i = imageElements.length - 1; i > 0; i--) {
        imageElements[i].remove();
      }
    }

    return wrapper;
  }

  async onDelete() {
    if (
      window.editorOperationState.isSaving ||
      window.editorOperationState.isClearing
    ) {
      // console.log("Skipping delete during editor operation");
      return;
    }

    try {
      const blockData = this._data;
      // console.log("Block data during deletion:", blockData);
      if (blockData.file && blockData.file.id && blockData.file.type) {
        const imageId = blockData.file.id;
        const imageType = blockData.file.type;

        // Axios DELETE request with Authorization header automatically included
        const response = await axios.delete(
          `${API_URL}/api/deleteImage/${imageType}/${imageId}`
        );

        const result = response.data;
        // console.log("Backend deletion response:", result);

        if (blockData.file.url) {
          window.uploadedImages.delete(blockData.file.url);
          // console.log("Image removed from tracking");
          // console.log(
          //   "Remaining tracked images:",
          //   Array.from(window.uploadedImages)
          // );
        }
      } else {
        console.warn("No image ID or type found in block data:", blockData);
      }
    } catch (error) {
      console.error("Error in delete callback:", error);
    }
  }

  removed() {
    // console.log("Block removed lifecycle hook called");
    if (
      !window.editorOperationState.isSaving &&
      !window.editorOperationState.isClearing
    ) {
      this.onDelete();
    }
  }
}

export default CustomImageTool;
