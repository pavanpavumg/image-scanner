import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function BeforeAfter({ originalUrl, processedUrl }){
  return (
    <div style={{display:'flex', gap:12}}>
      <div style={{flex:1}}>
        <h4>Before</h4>
        <TransformWrapper>
          <TransformComponent>
            <img src={originalUrl} alt="before" />
          </TransformComponent>
        </TransformWrapper>
      </div>
      <div style={{flex:1}}>
        <h4>After</h4>
        <TransformWrapper>
          <TransformComponent>
            <img src={processedUrl} alt="after" />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  )
}
