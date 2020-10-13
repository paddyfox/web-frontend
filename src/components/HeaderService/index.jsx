
import React from 'react';
import { PhaseBanner } from 'govuk-react-jsx';

import './styles.css';

function HeaderService() {
  return (
    <PhaseBanner
        tag={{
          children: [
            'alpha'
          ]
        }}
      >
        This is a web frontend service for teaching testing - your <a className="govuk-link" href="/feedback">feedback</a> will help us to improve it.
      </PhaseBanner>
  );
}

export default HeaderService;
