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
  // Reduced samples from 200 to 50 for faster hackathon performance
  const numSamples = 50;
  
  const xsData = [];
  const ysData = [];
  
  for (let i = 0; i < numSamples; i++) {
    // Generate random features [0..1]
    const features = Array.from({ length: 14 }, () => Math.random());
    xsData.push(features);
    
    // 모든 14개 피처를 종합적으로 활용한 복합 과실 점수(Synthetic Fault Equation)
    // 제보자(본인)의 잠재적 과실 요소들
    let myFault = 
      (features[1] * 0.5) +   // 읽씹 횟수
      (features[3] * 0.3) +   // 단일 'ㅋ' 개수 (비웃음)
      (features[6] * 0.4) +   // 마침표 비율 (단호함/냉정함)
      (features[11] * 0.6) +  // 단답 지수
      (features[12] * 0.8) -  // 대화 단절 표현
      (features[7] * 0.3) -   // 물음표 (소통 노력)
      (features[9] * 0.5);    // 메시지 길이 비율 (정성)

    // 상대방(other)의 잠재적 과실 요소들
    let otherFault = 
      (features[0] * 0.4) +   // 답장 지연 시간
      (features[2] * 0.5) +   // 심야 답장 (수면 방해 등)
      (features[5] * 0.6) +   // 단일 'ㅋ' 비중
      (features[8] * 0.4) +   // 말줄임표 (답답함 유발)
      (features[10] * 0.7) +  // 대문자/강조 (분노 표출)
      (features[13] * 0.4) -  // 연속 메시지 비율 (조급함)
      (features[4] * 0.3);    // 연타 'ㅋㅋㅋ' 비율 (진정성)

    // 점수가 0 이하로 내려가지 않도록 보정 및 기본 과실 0.1 부여
    myFault = Math.max(0.1, myFault);
    otherFault = Math.max(0.1, otherFault);

    // 두 과실 점수를 합이 1.0이 되도록 정규화(Normalization)
    const totalFault = myFault + otherFault;
    ysData.push([myFault / totalFault, otherFault / totalFault]);
  }
  
  const xs = tf.tensor2d(xsData, [numSamples, 14]);
  const ys = tf.tensor2d(ysData, [numSamples, 2]);
  
  // Fast train
  // Fast train: reduced epochs from 10 to 5
  await modelInstance.fit(xs, ys, { epochs: 5, batchSize: 32, shuffle: true });
  
  xs.dispose();
  ys.dispose();
};

export const runDLModel = async (featuresObj) => {
  if (!model) {
    model = createModel();
    await trainFakeModel(model);
  }
  
  // Map JSON to array in specific order
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
  
  // Normalize huge values to roughly [0..1] range for better MLP stability
  featureArray[0] = Math.min(featureArray[0] / 3600, 1.0); // max 1hr
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
  
  // Return the ratios (e.g. { me: 20, other: 80 })
  return {
    me: Math.round(data[0] * 100),
    other: Math.round(data[1] * 100)
  };
};
