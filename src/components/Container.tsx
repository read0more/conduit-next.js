import styled from 'styled-components';

export default styled.div`
  margin: 0 auto;
  padding: 0 1em;

  @media only screen and (max-width: 600px) {
    max-width: 540px;
  }

  @media only screen and (min-width: 768px) {
    max-width: 720px;
  }

  @media only screen and (min-width: 1200px) {
    max-width: 1024px;
  }
`;
