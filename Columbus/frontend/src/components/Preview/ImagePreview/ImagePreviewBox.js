import React from "react";
import {ImageList, ImageListItem} from "@material-ui/core";

export default function ImagePreviewBox({imageData}) {

    return (imageData ?
      
      <ImageList sx={{ width: 500, height: 450 }} cols={1} rowHeight={164} >

    <ImageListItem key={imageData}>
      <img
        src={imageData}
        alt="post"
        loading="lazy"
      />
    </ImageListItem>
</ImageList>: null);
}