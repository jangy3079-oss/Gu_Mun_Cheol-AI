import * as tf from '@tensorflow/tfjs';

// TensorFlow.js 4-Layer MLP Model
// Input: 14 features (from Gemini)
// Output: 2 elements [My Fault Ratio, Opponent Fault Ratio] (sums to 1.0)
let model = null;

const createModel = () => {
  const newModel = tf.sequential();
  
  // Layer 1: Input (14) -> Dense (64)
  newModel.add(tf.layers.dense({ inputShape: [14], units: 64, activation: 'relu' }));
  
  // Layer 2: Dense (32)
  newModel.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  
  // Layer 3: Dense (16)
  newModel.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  
  // Layer 4: Output (2) - Softmax for ratio (sum to 1)
  newModel.add(tf.layers.dense({ units: 2, activation: 'softmax' }));
  
  newModel.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy'
  });
  
  return newModel;
};

// Hackathon specific: Synthesize fake data to "train" the network so it acts somewhat deterministically.
// We'll train it purely in-memory in < 1 sec to make it output funny but structured results.
const trainFakeModel = async (modelInstance) => {
  // Increased epochs and samples for a "sharper" and more decisive model
  const numSamples = 100;
  
  const xsData = [];
  const ysData = [];
  
  for (let i = 0; i < numSamples; i++) {
    const features = Array.from({ length: 14 }, () => Math.random());
    xsData.push(features);
    
    // Aggressive Synthetic Fault Equation
    let myFault = 
      (features[1] * 1.5) +   // Heavily penalize read-without-reply
      (features[3] * 0.8) +   
      (features[6] * 1.0) +   
      (features[11] * 1.2) +  
      (features[12] * 2.0) -  // Massive penalty for ending conversation
      (features[7] * 0.5) -   
      (features[9] * 1.0);    

    let otherFault = 
      (features[0] * 1.2) +   
      (features[2] * 1.5) +   
      (features[5] * 1.8) +   
      (features[8] * 1.0) +   
      (features[10] * 2.0) +  // Massive penalty for aggression/caps
      (features[13] * 0.8) -  
      (features[4] * 0.6);    

    myFault = Math.max(0.01, myFault);
    otherFault = Math.max(0.01, otherFault);

    const totalFault = myFault + otherFault;
    ysData.push([myFault / totalFault, otherFault / totalFault]);
  }
  
  const xs = tf.tensor2d(xsData, [numSamples, 14]);
  const ys = tf.tensor2d(ysData, [numSamples, 2]);
  
  // Increased epochs to 15 for a more "opinionated" model
  await modelInstance.fit(xs, ys, { epochs: 15, batchSize: 32, shuffle: true });
  
  xs.dispose();
  ys.dispose();
};

export const runDLModel = async (featuresObj) => {
  if (!model) {
    model = createModel();
    await trainFakeModel(model);
  }
  
  const featureArray = [
    featuresObj.reply_delay_sec || 0,
    featuresObj.read_without_reply_count || 0,
    featuresObj.reply_after_midnight || 0,
    featuresObj.single_kk_count || 0,
    featuresObj.multi_kk_ratio || 0,
    featuresObj.single_kk_ratio || 0,
    featuresObj.period_at_end_ratio || 0,
    featuresObj.question_mark_count || 0,
    featuresObj.ellipsis_count || 0,
    featuresObj.message_length_ratio || 0,
    featuresObj.caps_or_bold_count || 0,
    featuresObj.single_char_reply_ratio || 0,
    featuresObj.conversation_ender_count || 0,
    featuresObj.double_message_ratio || 0
  ];
  
  featureArray[0] = Math.min(featureArray[0] / 3600, 1.0); 
  featureArray[1] = Math.min(featureArray[1] / 10, 1.0);
  featureArray[3] = Math.min(featureArray[3] / 20, 1.0);
  featureArray[7] = Math.min(featureArray[7] / 10, 1.0);
  featureArray[8] = Math.min(featureArray[8] / 10, 1.0);
  featureArray[10] = Math.min(featureArray[10] / 10, 1.0);
  featureArray[12] = Math.min(featureArray[12] / 5, 1.0);
  
  const inputTensor = tf.tensor2d([featureArray], [1, 14]);
  
  const prediction = model.predict(inputTensor);
  const data = await prediction.data();
  
  inputTensor.dispose();
  prediction.dispose();
  
  // DRAMATIC AMPLIFICATION LOGIC (Contrast Stretch)
  // We pull values away from 0.5 to make results more extreme
  let myRaw = data[0];
  let otherRaw = data[1];

  const ampFactor = 2.5; // High factor for "dramatic" results
  let myAmp = 0.5 + (myRaw - 0.5) * ampFactor;
  
  // Clamp between 0.05 and 0.95 to keep it "realistic" but spicy
  myAmp = Math.max(0.05, Math.min(0.95, myAmp));
  let otherAmp = 1.0 - myAmp;

  return {
    me: Math.round(myAmp * 100),
    other: Math.round(otherAmp * 100)
  };
};
