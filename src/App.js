import React, { useState, useEffect } from 'react';
import { 
  client, 
  useConfig, 
  useElementData
} from "@sigmacomputing/plugin";

client.config.configureEditorPanel([
  { type: "element", name: "source" },
  { type: "column", name: "Image_URL", source: "source", allowMultiple: false },
  { type: "column", name: "Image_Rank", source: "source", allowMultiple: false },
  { type: "text", name: "Rank Number", source: "source", defaultValue: "1" },
  { type: "checkbox", name: "Rank Ascending", source: "source" }
]);

function App() {
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!sigmaData) return;
    
    const urlArray = sigmaData?.[config.Image_URL] || [];
    const rankArray = sigmaData?.[config.Image_Rank] || [];
    const rankNumber = parseInt(config["Rank Number"], 10);
    const rankAscending = config["Rank Ascending"];

    let sortedImages = urlArray.map((url, index) => ({ url, rank: rankArray[index] || 0 }));
    
    sortedImages.sort((a, b) => rankAscending ? a.rank - b.rank : b.rank - a.rank);
    
    if (sortedImages.length > 0) {
      if (isNaN(rankNumber) || rankNumber < 1) {
        setImageUrl(sortedImages[0].url);
      } else if (rankNumber > sortedImages.length) {
        setImageUrl(sortedImages[sortedImages.length - 1].url);
      } else {
        setImageUrl(sortedImages[rankNumber - 1].url);
      }
    }
  }, [sigmaData, config]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0
    }}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="image not found"
          style={{
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      )}
    </div>
  );
}

export default App;
