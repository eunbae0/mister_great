function ProgressBar({ progress }) {
  const returnProgressBarByCurrentStep = (cur) => {
    switch (cur) {
      case 0:
        return (
          <>
            <div className="progressDot_Active" />
            <div className="progressLine_InActive" />
            <div className="progressDot_InActive" />
            <div className="progressLine_InActive" />
            <div className="progressDot_InActive" />
          </>
        );
      case 1:
        return (
          <>
            <div className="progressDot_Active" />
            <div className="progressLine_Active" />
            <div className="progressDot_Active" />
            <div className="progressLine_InActive" />
            <div className="progressDot_InActive" />
          </>
        );
      case 2:
        return (
          <>
            <div className="progressDot_Active" />
            <div className="progressLine_Active" />
            <div className="progressDot_Active" />
            <div className="progressLine_Active" />
            <div className="progressDot_Active" />
          </>
        );
      default:
        return (
          <>
            <div className="progressDot_Active" />
            <div className="progressLine_InActive" />
            <div className="progressDot_InActive" />
            <div className="progressLine_InActive" />
            <div className="progressDot_InActive" />
          </>
        );
    }
  };
  return <div className="progressBar_Wrapper">{returnProgressBarByCurrentStep(progress)}</div>;
}

export default ProgressBar;