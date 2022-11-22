const defaultFlags = {
  datasetSchemaCreation: { active: false },
};

export default {
  initFeatures: () => {
    if (!localStorage.getItem('flags')) {
      localStorage.setItem('flags', JSON.stringify(defaultFlags));
    }
  },
  isEnabled: (name: string) => {
    const features = JSON.parse(localStorage.getItem('flags') || '{}');
    return features && features[name] ? features[name].active : true;
  },
};
