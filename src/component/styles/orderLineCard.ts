import styled from 'styled-components';

export const ProductCard = styled.div`
  background-color: #FFFFFE;
  box-shadow: 0 0 .25em #eee;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 2em;
  min-height: 100px;
  padding: .5em 3em .5em 2em;
  margin-bottom: 1em;

  img {
    width: 100%;
    max-width: 130px;
  }
`;

export const OrderLineDetails = styled.div`
  min-width: 80px;

  h2 {
    margin: 0;
    font-size: 1em;
  }
`;

export const LocationDetails = styled.div`
  min-width: 200px;
  padding-left: 1.25em;
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
