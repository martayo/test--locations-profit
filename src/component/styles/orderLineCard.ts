import styled from 'styled-components';

export const Card = styled.div`
  background-color: #FFFFFE;
  box-shadow: 0 0 .25em #eee;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: .5em 3em .5em 2em;
  margin-bottom: 1em;

  span {
    display: block;
    color: #888;
  }
  > div {
    width: 20%;
    &:first-child {
      width: 15%;
    }
    &:last-child {
      width: 25%;
    }
  }
`;

export const ProductDetails = styled.div`
  img {
    height: 100%;
    max-height: 80px;
    float: left;
    margin-right: .25em;
  }
  h2 {
    margin: 1.2em 0 0;
    font-size: 1em;
  }
`;

interface PercentageBarProps {
  size: number;
}
export const PercentageBar = styled.div<PercentageBarProps>`
  display: block;
  width: 100%;
  border-bottom: 4px solid #ddd;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &:before {
    content: ' ';
    position: absolute;
    left: 0;
    bottom: -4px;
    background-color: #6AAC00;
    width: ${props => `${props.size}%`};
    height: 4px;
  }
`;

export const Error = styled.p`
  color: red;
`;
