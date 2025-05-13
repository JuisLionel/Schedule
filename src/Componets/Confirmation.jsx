import '../Style/Confirmation.css';

export default function Confirmation({ y, n, pendingAction }) {

    return (
        <div className="confirmation">
            <div className="content">

                {pendingAction === 'GakBisa' && (
                    <h2>Are you sure that you want to skip your turn?</h2>
                )}

                {pendingAction === 'Bisa' && (
                    <h2>Are you sure that you can do the dish?</h2>
                )}

                <div className="buttons">
                    <button onClick={n} id='n'>No</button>
                    <button onClick={y} id='y'>Yes</button>
                </div>
            </div>
        </div>
    );
}
