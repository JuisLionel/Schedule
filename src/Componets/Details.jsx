export default function Details({ nextTurn, lionelSkip, felixSkip }) {
    return (
        <div className='Check'>
            <div className='dishes'>
                <h2>Besok giliran: <strong>{nextTurn}</strong></h2>
                <h2>---------------------------</h2>
                <h3>Lionel Skip: {lionelSkip}</h3>
                <h3>Felix Skip: {felixSkip}</h3>
            </div>
        </div>
    );
}
