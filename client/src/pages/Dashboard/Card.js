import Card from 'react-bootstrap/Card';


const InfoCard = (props) => {
    const { title, value, color } = props
    return (
        <Card style={{ width: '25%', backgroundColor: 'white' }} className='card-custom'>
            <Card.Body>
                    <div style={{ color: color }}>
                        <h3>
                            {value}
                        </h3>
                    </div>
                    <div>
                        <h6 style={{ opacity: '53%' }}>
                            {title}
                        </h6>
                    </div>
            </Card.Body>
        </Card>
    );
}

export default InfoCard;
