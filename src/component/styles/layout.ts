import styled from 'styled-components';

export const RootCard = styled.div`
  background-color: #FAFAFC;
  box-shadow: 0 0 1em #ccc;
  max-width: 1200px;
  box-sizing: border-box;
  overflow: hidden;
  margin: 1.5em auto;
  font-size: .85em;
  line-height: 1.75em;
`;

export const HeadWrap = styled.div`
  padding: 3em 6em 1.5em;
  background-color: #fff;
  border-bottom: 4px solid #D42A56;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;

  h1 {
    margin: 1.5em 0 .25em;
  }
  > div {
    width: 50%;
  }
  strong {
    display: inline-block;
    width: 30%;
    max-width: 200px;
  }
`;

export const BodyWrap = styled.div`
  padding: 3em 3em 2em;
`;
